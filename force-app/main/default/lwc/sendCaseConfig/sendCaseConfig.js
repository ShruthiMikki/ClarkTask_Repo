import { LightningElement,api, wire } from 'lwc';
import CaseConfigUpdated from '@salesforce/messageChannel/CaseConfigUpdated__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import {
    subscribe,
    unsubscribe,
    MessageContext
  } from "lightning/messageService";
import postCaseConfigs from "@salesforce/apex/CaseConfigPost.PostConfig"
import FetchCaseConfigs from "@salesforce/apex/CaseConfigPost.FetchCaseConfig"


export default class SendCaseConfig extends NavigationMixin(LightningElement)  {
    @wire(MessageContext)
    messageContext;
    receivedMessage;
    configList = [];
    @api recordId; 

   FetchCaseConfigRecords(){
       FetchCaseConfigs({
        CaseId: this.recordId
       })
        .then(response => {
            if(response != null){
                this.configList = response;
            }
        }).catch(error =>{
            console.error("error in apex ", JSON.parse(JSON.stringify(error)))
        });
   }  
    
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
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
            .then(response => {
                if(response){
                    console.log('response '+response);
                    const event = new ShowToastEvent({
                        title: 'Success!',
                        variant: 'success',
                        message: 'Case details are sent successfully.',
                    });
                    this.dispatchEvent(event);
                }
            }).catch(error =>{
                console.error("error in apex ", JSON.parse(JSON.stringify(error)))
            });
    }
}