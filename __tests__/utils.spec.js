import { formatChannelName, buildSlackAttachments } from '../src/utils';
import { GITHUB_PUSH_EVENT, GITHUB_PR_EVENT } from '../fixtures';

describe('Utils', () => {
  process.env.GITHUB_REPOSITORY = 'voxmedia/github-action-slack-notify-build';

  describe('formatChannelName', () => {
    it('strips #', () => {
      expect(formatChannelName('#app-notifications')).toBe('app-notifications');
    });

    it('strips @', () => {
      expect(formatChannelName('@app.buddy')).toBe('app.buddy');
    });
  });

  describe('buildSlackAttachments', () => {
    it('passes color', () => {
      const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

      expect(attachments[0].color).toBe('good');
    });

    it('shows status', () => {
      const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

      expect(attachments[0].fields.find(a => a.title === 'Status')).toEqual({
        title: 'Status',
        value: 'STARTED',
        short: true,
      });
    });

    it('show author/actor', () => {
      const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

      expect(attachments[0].fields.find(a => a.title === 'Author')).toEqual({
        title: 'Author',
        value: 'TestUser',
        short: true,
      });
    });

    it('show environment', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        github: GITHUB_PUSH_EVENT,
        environment: 'test',
      });

      expect(attachments[0].fields.find(a => a.title === 'Environment')).toEqual({
        title: 'Environment',
        value: 'test',
        short: true,
      });
    });

    it('highlight prod environment', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        github: GITHUB_PUSH_EVENT,
        environment: 'prod',
      });

      expect(attachments[0].fields.find(a => a.title === 'Environment')).toEqual({
        title: 'Environment',
        value: '`prod`',
        short: true,
      });
    });

    it('show custom fields', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        github: GITHUB_PUSH_EVENT,
        custom_fields: [{ title: 'custom', value: 'test', short: true }],
      });

      expect(attachments[0].fields.find(a => a.title === 'custom')).toEqual({
        title: 'custom',
        value: 'test',
        short: true,
      });
    });

    it('show stage', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        github: GITHUB_PUSH_EVENT,
        stage: 'test',
      });

      expect(attachments[0].fields.find(a => a.title === 'Stage')).toEqual({
        title: 'Stage',
        value: 'test',
        short: true,
      });
    });

    describe('for push events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Action')).toEqual({
          title: 'Action',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/abc123/checks | CI>`,
          short: true,
        });
      });

      it('shows the event name', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Event')).toEqual({
          title: 'Event',
          value: 'push',
          short: true,
        });
      });

      it('links to the branch', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Branch')).toEqual({
          title: 'Branch',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/abc123 | my-branch>`,
          short: true,
        });
      });
    });

    describe('for PR events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PR_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Action')).toEqual({
          title: 'Action',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/xyz678/checks | CI>`,
          short: true,
        });
      });

      it('shows the event name', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PR_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Event')).toEqual({
          title: 'Event',
          value: 'pull_request',
          short: true,
        });
      });

      it('links to the PR', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PR_EVENT });

        expect(attachments[0].fields.find(a => a.title === 'Pull Request')).toEqual({
          title: 'Pull Request',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/pulls/1 | This is a PR>`,
          short: true,
        });
      });
    });
  });
});
