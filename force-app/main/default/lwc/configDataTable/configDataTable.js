import { LightningElement, api } from 'lwc';

export default class ConfigDataTable extends LightningElement {

    @api tableRecords;
    columns =  [
        {label: 'Label', fieldName: 'Label__c', type: 'text',  sortable: "true", hideDefaultActions: true, wrapText: true},
        {label: 'Type', fieldName: 'Type__c', type: 'text', sortable: "true", hideDefaultActions: true, wrapText: true},
        {label: 'Amount', fieldName: 'Amount__c', type: 'text', sortable: "true", hideDefaultActions: true, wrapText: true}
     ];
    sortBy;
    sortDirection;
    @api showCheckBox = false;
    @api showRowNumber = false;
    selectedLabelsList = [];

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.tableRecords));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.tableRecords = parseData;
    }

    handleRowAction(event) {
        this.selectedLabelsList = event.detail.selectedRows;
    }

    @api
    get sendSelectedList(){
        return this.selectedLabelsList;
    }

}