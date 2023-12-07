import {crossplaneAwsPlugin} from './plugin';

describe('crossplane-ecs', () => {
    it('should export plugin', () => {
        expect(crossplaneAwsPlugin).toBeDefined();
    });
});
