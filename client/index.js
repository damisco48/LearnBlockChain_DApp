//import { reject } from 'lodash';
import Web3 from 'web3';
import AuthenticationContract from '../build/contracts/AuthenticationContract.json';

let web3;
let authenticationContract;

const initWeb3 = ()=> {
    return new Promise((resolve, reject) => {
        //case 1: new metamask is present
        if( typeof window.ethereum !== 'undefined'){
            window.ethereum.enable()
            .then(() => {
                resolve(
                    new Web3(window.ethereum)
                );

            }) 
            .catch(e => {
                reject(e);
            }); 
            return;        
        
        }
        //case 2: old metamask is present
        if(typeof window.web3 !== 'undefined'){
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        //case 3: no metamask present, just connect to ganache
        resolve(new Web3('http://localhost:9545'));

    });

};

const initContract = () => {
    const deploymentKey = Object.keys(
        AuthenticationContract.networks
    )[0];
    return new web3.eth.Contract(
        AuthenticationContract.abi,
        AuthenticationContract
        .networks[deploymentKey]
        .address
    );

};
 const initApp = () =>{
     const $addAdmin =document.getElementById('addAdmin');
     const $adminResult =   document.getElementById('admin_result');

     let accounts =[];

     web3.eth.getAccounts()
     .then(_accounts => {
         accounts = _accounts;
         return authenticationContract.methods
         .getAll()
         .call();
     })
     .then(result => {
         $adminResult.innerHTML = result.join('');
     });
     
     $addAdmin.addEventListener('submit', e => {
         e.preventDefault();
         const newAdmin = e.target.elements[0].value;
         authenticationContract.methods
            .addAdmin(newAdmin)
            .send({from: accounts[0]})
            .then(()=> {
                $adminResult.innerHTML = `New user ${newAdmin} was successfully added`;
            }) 
            .catch(()=>{
                $adminResult.innerHTML =`Oops, error  adding admin`;
            });

         });
    };

 document.addEventListener('DOMContentLoaded',()=> {
     initWeb3()
        .then(_web3 => { 
            web3 = _web3;
            authenticationContract = initContract();
            initApp();
        })
        .catch(e => console.log(e.message));
 });