public class CaseConfigPost {
    @AuraEnabled
    Public static boolean PostConfig(String CaseId){
        Case UpdateCase = new case();
        UpdateCase.id = CaseId;
        UpdateCase.Status = 'Closed';
        Update UpdateCase;
        processRecords(CaseId);
        return true;
    }
    
    @Future(callout=true)
    public static void processRecords(String CaseId){ 
        try
        {
            List<Case_Config__c> caseConfigList = FetchCaseConfig(CaseId);
            CaseConfigWrapper CaseConfig = new CaseConfigWrapper();
            CaseConfig.caseId = CaseId;
            CaseConfig.status = 'Close';
            caseConfig cc ;
            List<caseConfig> caseConfigWrapperList = new List<caseConfig>();
            for(Case_Config__c c: caseConfigList){
                cc = new caseConfig();
                cc.label = c.Label__c;
                cc.type = c.Type__c;
                cc.amount = c.Amount__c;
                caseConfigWrapperList.add(cc);
            }
            CaseConfig.caseConfigs = caseConfigWrapperList;
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://clark.requestcatcher.com/test');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            request.setBody( JSON.serialize(CaseConfig));
            HttpResponse response = http.send(request);
            if(response.getStatusCode() != 200) {
                CalloutException e = new CalloutException();
                e.setMessage('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getStatus());
                throw e;
            } else {
                System.debug('Success');
            }
        }
        catch (Exception e)
        { 
            system.debug(e);
        }
    }
    
    
    @AuraEnabled
    Public static String CreateCaseConfig(List<Config__c> ConfigList, String CaseId){
        List<Case_Config__c> CaseConfigInsertList = new List<Case_Config__c>();
        Map<String, Case_Config__c> CaseConfigMap = new Map<String, Case_Config__c>();
        List<Case_Config__c> CaseConfigList = [select id, name, Amount__c, Case__c, Label__c, Type__c from Case_Config__c where Case__c =: CaseId];
        for(Case_Config__c caseConfig: CaseConfigList){
            CaseConfigMap.put(caseConfig.Label__c, caseConfig);
        }
        Case_Config__c CaseConfig;
        for(Config__c config: ConfigList){
            if(!CaseConfigMap.containskey(config.Label__c)){
                CaseConfig = new Case_Config__c();
                CaseConfig.Amount__c = config.Amount__c;
                CaseConfig.Label__c = config.Label__c;
                CaseConfig.Type__c = config.Type__c;
                CaseConfig.Case__c = CaseId;
                CaseConfigInsertList.add(CaseConfig);
            }
        }
        if(CaseConfigInsertList != null && CaseConfigInsertList.size()>0){
            insert CaseConfigInsertList;
        }
        return 'Success';
    }
    
    @AuraEnabled
    Public static List<Case_Config__c> FetchCaseConfig(String CaseId){
        List<Case_Config__c> CaseConfigList = new List<Case_Config__c>();
        CaseConfigList = [select id, name, Amount__c, Case__c, Label__c, Type__c from Case_Config__c where Case__c =: CaseId order by Label__c];
        return CaseConfigList;
    }
    @AuraEnabled
    Public static FetchConfigWrapper FetchConfig(String CaseId){
        List<Config__c> ConfigList = new List<Config__c>();
        ConfigList = [select id, name, Amount__c, Label__c, Type__c from Config__c  order by Label__c];
        Case c = [select id, status from case where id=:CaseId ];
        FetchConfigWrapper configWrap = new FetchConfigWrapper();
        configWrap.ConfigList = ConfigList;
        configWrap.caseStatus = c.status;
        return configWrap;
    }

    Public class FetchConfigWrapper{
        @AuraEnabled public List<Config__c> ConfigList;
        @AuraEnabled public String caseStatus;
    }
    public class CaseConfigWrapper{
        @AuraEnabled public String caseId;
        @AuraEnabled public String status;
        @AuraEnabled public List<caseConfig> caseConfigs = new List<caseConfig>();
    }
    public class caseConfig{
        @AuraEnabled public String label;
        @AuraEnabled public String type;
        @AuraEnabled public Decimal amount;
    }
}