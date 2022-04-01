import { LightningElement,api, wire } from 'lwc';
import CaseConfigUpdated from '@salesforce/messageChannel/CaseConfigUpdated__c';


import {
    subscribe,
    unsubscribe,
    MessageContext
  } from "lightning/messageService";
//import { NavigationMixin } from 'lightning/navigation';
import postCaseConfigs from "@salesforce/apex/CaseConfigPost.PostConfig"
import FetchCaseConfigs from "@salesforce/apex/CaseConfigPost.FetchCaseConfig"


export default class SendCaseConfig extends LightningElement {
    @wire(MessageContext)
    messageContext;
    receivedMessage;
    accList = [];
    columns =  [
        {label: 'Label', fieldName: 'Label__c', type: 'text'},
        {label: 'Type', fieldName: 'Type__c', type: 'text'},
        {label: 'Amount', fieldName: 'Amount__c', type: 'text'}
     ];
    @api recordId;
    connectedCallback(){
        console.log("inside connectedCallback 22 "+this.recordId);
        this.FetchCaseConfigRecords();
   }  

   FetchCaseConfigRecords(){
       console.log('inside postCaseConfigs2');
       FetchCaseConfigs({
        CaseId: this.recordId
       })
        .then(response => {
            if(response != null){
                console.log("Handle click  "+JSON.stringify(response));
                this.accList = response;
            }
        }).catch(error =>{
            console.error("error in apex ", JSON.parse(JSON.stringify(error)))
        });
   }  
    /*handelClick({
        CaseId: recordId
    }){
        console.log("Handle click");
        postCaseConfigs().then(result=>{
            if(result != null){
                console.log("Handle click  "+result);
            }
        })
    }*/
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        console.log('inside subscribeToMessageChannel');
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                CaseConfigUpdated,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.receivedMessage = message
          ? JSON.stringify(message, null, "\t")
          : "no message";
          console.log('receivedMessage  '+this.receivedMessage);
          if(this.receivedMessage){
            this.FetchCaseConfigRecords();
          }
      }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
        this.FetchCaseConfigRecords();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    handelClick(){
        console.log('handelClick  '+this.recordId);
        postCaseConfigs({
            CaseId: this.recordId
        })
            .this(response => {
                if(response != null){
                    console.log("Handle click  "+response);
                }
            }).catch(error =>{
                console.error("error in apex ", JSON.parse(JSON.stringify(error)))
            });
    }
}