import { LightningElement,api, wire } from 'lwc';
//import { NavigationMixin } from 'lightning/navigation';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import CaseConfigUpdated from '@salesforce/messageChannel/CaseConfigUpdated__c';

import FetchConfig from "@salesforce/apex/CaseConfigPost.FetchConfig"
import CreateCaseConfig from "@salesforce/apex/CaseConfigPost.CreateCaseConfig"
export default class AvailableConfigs extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @api recordId;
    accList = [];
    selectedLabelsList = [];
    columns =  [
        {label: 'Label', fieldName: 'Label__c', type: 'text'},
        {label: 'Type', fieldName: 'Type__c', type: 'text'},
        {label: 'Amount', fieldName: 'Amount__c', type: 'text'}
     ];
    

    connectedCallback(){
        console.log("inside connectedCallback 22 "+this.recordId);
        FetchConfig({
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
   handleRowAction(event) {
        console.log('handleRowAction6  '+JSON.stringify(event.detail.selectedRows));
        this.selectedLabelsList = event.detail.selectedRows;
    }
    handelClick(){
        console.log('this.selectedLabelsList2  '+JSON.stringify(this.selectedLabelsList));
        CreateCaseConfig({
            ConfigList: this.selectedLabelsList,
            CaseId: this.recordId
           })
            .then(response => {
                if(response != null){
                    console.log("Handle click  "+JSON.stringify(response));
                    //this.accList = response;
                    const messaage = {
                        refreshTable: true
                      };
                    console.log("messaage  "+JSON.stringify(messaage));
                    publish(this.messageContext, CaseConfigUpdated, messaage);
                }
            }).catch(error =>{
                console.error("error in apex ", JSON.parse(JSON.stringify(error)))
            });
    }
}