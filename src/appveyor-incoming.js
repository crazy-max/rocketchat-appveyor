/**
 * appveyor-incoming.js
 * Add AppVeyor notifications via a new WebHook in Rocket.Chat
 * @license MIT
 * @version 0.2
 * @author  CrazyMax, https://github.com/crazy-max
 * @updated 2018-10-14
 * @link    https://github.com/crazy-max/rocketchat-appveyor
 */

/* globals console, _, s */

const USERNAME = 'AppVeyor';
const AVATAR_URL = 'https://raw.githubusercontent.com/crazy-max/rocketchat-appveyor/master/res/avatar.png';

/* exported Script */
class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    let data = request.content;
    let attachmentColor = `#36A64F`;
    let statusText = `completed`;
    let isFailed = data.eventName !== `build_success`;
    if (isFailed) {
      attachmentColor = `#A63636`;
      statusText = `failed`;
    }

    let attachmentText = `Commit [${data.eventData.commitId}](${data.eventData.commitUrl}) by ${data.eventData.commitAuthor}`;
    if(data.eventData.isPullRequest) {
      attachmentText += ` in PR [#${data.eventData.pullRequestId}](${data.eventData.pullRequestUrl})`;
    }
    attachmentText += ` on ${data.eventData.commitDate}: _${data.eventData.commitMessage}_`;

    return {
      content: {
        username: USERNAME,
        icon_url: AVATAR_URL,
        text: `Build [#${data.eventData.buildNumber}](${data.eventData.buildUrl}) has ${statusText} for project ${data.eventData.projectName}.`,
        attachments: [{
          text: attachmentText,
          color: attachmentColor
        }]
      }
    };
  }
}
