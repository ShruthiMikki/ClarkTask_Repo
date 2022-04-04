@isTest
public class CaseConfigPostTest {
    @testSetup static void setup() {
        List<Config__c> ConfigList = new List<Config__c>();
         for(Integer i=0;i<10;i++) {
         	ConfigList.add(new Config__c (Amount__c = i*100, Label__c = 'Config'+i, Type__c = 'type'+i));
         }
        insert ConfigList;
        Case ca = new Case(Subject='Test Case');
        insert ca;
    }
    
    @isTest static void FetchConfig() {
        Case ca = [select id from Case];
        List<Config__c> configList = CaseConfigPost.FetchConfig();
        System.assertEquals(10, configList.size());
        List<Config__c> selectedConfigList = new List<Config__c>();
        for(integer i =0;i<2;i++){
			selectedConfigList.add(configList[i]);
        }
        CaseConfigPost.CreateCaseConfig(selectedConfigList, ca.id);
        List<Case_Config__c> caseconfigList = CaseConfigPost.FetchCaseConfig(ca.id);
        System.assertEquals(2, caseconfigList.size());
        CaseConfigPost.PostConfig(ca.id);
    }
    
    @isTest static void FetchCaseConfig() {
    	Case ca = [select id from Case];
        List<Config__c> configList = CaseConfigPost.FetchConfig();
        List<Config__c> selectedConfigList = new List<Config__c>();
        for(integer i =0;i<2;i++){
			selectedConfigList.add(configList[i]);
        }
        CaseConfigPost.CreateCaseConfig(selectedConfigList, ca.id);
        for(integer i =0;i<4;i++){
			selectedConfigList.add(configList[i]);
        }
        CaseConfigPost.CreateCaseConfig(selectedConfigList, ca.id);
        List<Case_Config__c> caseconfigList = CaseConfigPost.FetchCaseConfig(ca.id);
        System.assertEquals(4, caseconfigList.size());
    }
    
    @isTest static void PostConfig() {
    	Case ca = [select id from Case];
        List<Config__c> configList = CaseConfigPost.FetchConfig();
        List<Config__c> selectedConfigList = new List<Config__c>();
        for(integer i =0;i<2;i++){
			selectedConfigList.add(configList[i]);
        }
        CaseConfigPost.CreateCaseConfig(selectedConfigList, ca.id);
        for(integer i =0;i<4;i++){
			selectedConfigList.add(configList[i]);
        }
        CaseConfigPost.CreateCaseConfig(selectedConfigList, ca.id);
        List<Case_Config__c> caseconfigList = CaseConfigPost.FetchCaseConfig(ca.id);
        System.assertEquals(4, caseconfigList.size());
        CaseConfigPost.PostConfig(ca.id);
    }
}