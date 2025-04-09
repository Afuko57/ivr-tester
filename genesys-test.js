const { PureCloudPlatformClientV2 } = require('platformClient');
require('dotenv').config();

const client = PureCloudPlatformClientV2.ApiClient.instance;
client.setEnvironment(PureCloudPlatformClientV2.PureCloudRegionHosts.us_east_1); 
client.loginClientCredentialsGrant(
  process.env.GENESYS_CLIENT_ID,
  process.env.GENESYS_CLIENT_SECRET
)
  .then(() => {
    console.log('ล็อกอินสำเร็จ!');
    testIVRFlow();
  })
  .catch((err) => {
    console.error('เกิดข้อผิดพลาดในการล็อกอิน:', err);
  });

async function testIVRFlow() {
  try {
    const architectApi = new PureCloudPlatformClientV2.ArchitectApi();
    
    const flowId = process.env.GENESYS_FLOW_ID;
    const flow = await architectApi.getFlow(flowId);
    console.log('ข้อมูล Flow:', flow);
    
    // จำลองการโทรเข้า IVR (ใช้ Tracking API)
    const flowExecutionRequest = {
      flowId: flowId,
      inputData: {
        ani: '+6612345678', 
        dnis: '+6687654321', 
        callerId: 'test-call-' + Date.now()
      }
    };
    
    const trackingApi = new PureCloudPlatformClientV2.FlowExecutionTracking();
    const flowExecution = await trackingApi.postFlowsExecutions(flowExecutionRequest);
    console.log('Flow Execution:', flowExecution);
    
    const dtmfRequest = {
      flowExecutionId: flowExecution.id,
      eventName: 'DTMF_RECEIVED',
      eventData: {
        digits: '123456'
      }
    };
    
    await trackingApi.postFlowsExecutionsExecutionIdEvents(flowExecution.id, dtmfRequest);
    console.log('ส่งรหัส PIN แล้ว');
    
    const result = await trackingApi.getFlowsExecutionsExecutionId(flowExecution.id);
    console.log('ผลการทำงานของ Flow:', result);
    
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการทดสอบ:', err);
  }
}