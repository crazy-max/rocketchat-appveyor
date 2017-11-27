/**
 * appveyor-incoming.js
 * Add Appveyor notifications via a new WebHook in Rocket.Chat
 * @license MIT
 * @version 0.1
 * @author  CrazyMax, https://github.com/crazy-max
 * @updated 2017-11-27
 * @link    https://github.com/crazy-max/rocketchat-appveyor
 */

/* globals console, _, s */

const getData = (obj) => {
  let statusColor = "#36A64F";
  let statusText = "completed";
  if (obj.eventName !== "build_success") {
    statusColor = "#A63636";
    statusText = "failed";
  }

  return {
    projectName: obj.eventData.projectName,
    statusColor: statusColor,
    statusText: statusText,
    buildNumber: obj.eventData.buildNumber,
    buildUrl: obj.eventData.buildUrl,
    commitId: obj.eventData.commitId,
    commitAuthor: obj.eventData.commitAuthor,
    commitMessage: obj.eventData.commitMessage,
    commitDate: obj.eventData.commitDate,
    commitUrl: obj.eventData.commitUrl,
    isPullRequest: obj.eventData.isPullRequest,
    pullRequestId: obj.eventData.pullRequestId,
    pullRequestUrl: obj.eventData.pullRequestUrl,
  };
};

const buildMessage = (obj) => {
  const data = getData(obj);

  let template = `[Build ${data.projectName} ${data.buildNumber} ${data.statusText}](${data.buildUrl})`;
  template += "\n" + `Commit [${data.commitId}](${data.commitUrl}) by ${data.commitAuthor}`;
  if(data.isPullRequest) {
    template += ` in PR [#${data.pullRequestId}](${data.pullRequestUrl})`;
  }
  template += ` on ${data.commitDate}: _${data.commitMessage}_`;

  return {
    text: template,
    color: data.statusColor
  };
};

/* exported Script */
class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    msg = buildMessage(request.content);
    return {
      content:{
        attachments: [{
          text: msg.text,
          color: msg.color
        }]
      }
    };
  }
}
