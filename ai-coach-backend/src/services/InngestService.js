import { Inngest } from 'inngest';
import IndustryService from './IndustryService.js';

export const inngest = new Inngest({ 
  id: 'ai-coach',
  name: 'AI Coach Industry Insights'
});

export const updateIndustryInsights = inngest.createFunction(
  { id: 'update-industry-insights' },
  { cron: '0 2 * * 0' }, 
  async ({ event, step }) => {
    const industryService = new IndustryService();

    const industriesToUpdate = await step.run('get-industries-needing-update', async () => {
      return await industryService.getIndustriesNeedingUpdate();
    });

    for (const industry of industriesToUpdate) {
      await step.run(`update-${industry.industry}`, async () => {
        console.log(`Updating insights for ${industry.industry}`);
        return await industryService.refreshIndustryInsights(industry.industry);
      });
    }

    return { 
      message: `Updated ${industriesToUpdate.length} industries`,
      industries: industriesToUpdate.map(i => i.industry)
    };
  }
);

export const triggerIndustryUpdate = inngest.createFunction(
  { id: 'trigger-industry-update' },
  { event: 'industry/update.requested' },
  async ({ event, step }) => {
    const { industry } = event.data;
    const industryService = new IndustryService();
    
    const updatedInsights = await step.run('update-industry', async () => {
      return await industryService.refreshIndustryInsights(industry);
    });

    return { 
      message: `Updated insights for ${industry}`,
      insights: updatedInsights
    };
  }
);

export const sendIndustryInsights = inngest.createFunction(
  { id: 'send-industry-insights' },
  { event: 'industry/insights.updated' },
  async ({ event, step }) => {
    console.log('Industry insights updated:', event.data);
    
    return { 
      message: 'Industry insights notification sent',
      industry: event.data.industry
    };
  }
);

export default inngest;