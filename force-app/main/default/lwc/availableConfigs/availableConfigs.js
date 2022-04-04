import { LightningElement,api, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import CaseConfigUpdated from '@salesforce/messageChannel/CaseConfigUpdated__c';

import FetchConfig from "@salesforce/apex/CaseConfigPost.FetchConfig"
import CreateCaseConfig from "@salesforce/apex/CaseConfigPost.CreateCaseConfig"
export default class AvailableConfigs extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @api recordId;
    configList = [];
    selectedLabelsList = [];
    sortBy;
    sortDirection;
    disable = false;

    connectedCallback(){
        FetchConfig({
            CaseId: this.recordId
           })
            .then(response => {
                if(response != null){
                    this.configList = response.ConfigList;
                    if(response.caseStatus === 'Closed'){
                        this.disable = true;
                    }
                }
            }).catch(error =>{
                console.error("error in apex ", JSON.parse(JSON.stringify(error)))
            });
    } 

    handelClick(){
        
        let childCmp = this.template.querySelector('c-config-data-table');
        this.selectedLabelsList = childCmp.sendSelectedList;
        //selectedLabelsList = a;
        CreateCaseConfig({
            ConfigList: this.selectedLabelsList,
            CaseId: this.recordId
           })
            .then(response => {
                if(response != null){
                    const messaage = {
                        refreshTable: true
                      };
                    publish(this.messageContext, CaseConfigUpdated, messaage);
                }
            }).catch(error =>{
                console.error("error in apex ", JSON.parse(JSON.stringify(error)))
            });
    }
}