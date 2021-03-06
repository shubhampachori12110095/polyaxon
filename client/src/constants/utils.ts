import * as Cookies from 'js-cookie';
import * as moment from 'moment';

import { TokenStateSchema } from '../models/token';
import { fetchUser } from '../actions/user';
import { BASE_URL } from '../constants/api';

export const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

export let urlifyProjectName = function (projectName: string) {
  // Replaces . by /
  let re = /\./gi;
  return projectName.replace(re, '\/');
};

export let splitProjectName = function (projectName: string) {
  return projectName.split('.');
};

export let splitGroupName = function (groupName: string) {
  return groupName.split('.');
};

export let getCssClassForStatus = function (status?: string): string {
  if (status === 'Succeeded') {
    return 'success';
  } else if (status === 'Stopped') {
    return 'danger';
  } else if (status === 'Failed') {
    return 'danger';
  } else if (status === 'Created') {
    return 'info';
  }
  return 'warning';
};

export let sortByUpdatedAt = function (a: any, b: any): any {
  let dateB: any = new Date(b.updated_at);
  let dateA: any = new Date(a.updated_at);
  return dateB - dateA;
};

export let pluralize = function (name: string, numObjects: number): string {
  if (numObjects !== 1) {
    return name + 's';
  }
  return name;
};

export let getToken = function (): TokenStateSchema | null {
  let user = Cookies.get('user');
  let token = Cookies.get('token');
  if (user !== undefined && token !== undefined) {
    return {token: token, user: user};
  }
  return null;
};

export let isUserAuthenticated = function () {
  return getToken() !== null;
};

export let getHomeUrl = function () {
  let user = Cookies.get('user');
  return `/app/${user}/`;
};

export let getLoginUrl = function (external?: boolean) {
  external = external || false;
  let loginUrl = '/users/login/';
  return external ? `${BASE_URL}${loginUrl}` : loginUrl;
};

export let getLogoutUrl = function () {
  return `/users/logout/`;
};

export let getUserUrl = function (username: string) {
  return `/app/${username}`;
};

export let getProjectUrl = function (username: string, projectName: string) {
  return `/app/${username}/${projectName}`;
};

export let getTensorboardUrl = function (username: string, projectName: string) {
  return `/tensorboard/${username}/${projectName}/`;
};

export let getNotebookUrl = function (username: string, projectName: string) {
  return `/notebook/${username}/${projectName}/`;
};

export let getProjectUniqueName = function (username: string, projectName: string) {
  return `${username}.${projectName}`;
};

export let getGroupUrl = function (username: string, projectName: string, groupSequence: number) {
  let projectUrl = getProjectUrl(username, projectName);
  return `${projectUrl}/groups/${groupSequence}/`;
};

export let getGroupUniqueName = function (username: string, projectName: string, groupSequence: number) {
  let projectUniqueName = getProjectUniqueName(username, projectName);
  return `${projectUniqueName}.${groupSequence}`;
};

export let getExperimentUrl = function (username: string, projectName: string, experimentSequence: number) {
  let projectUrl = getProjectUrl(username, projectName);
  return `${projectUrl}/experiments/${experimentSequence}/`;
};

export let getExperimentUniqueName = function (username: string, projectName: string, experimentSequence: number) {
  let projectUniqueName = getProjectUniqueName(username, projectName);
  return `${projectUniqueName}.${experimentSequence}`;
};

export let getJobtUrl = function (username: string,
                                  projectName: string,
                                  experimentSequence: number,
                                  jobSequence: number) {
  let experimentUrl = getExperimentUrl(username, projectName, experimentSequence);

  return `${experimentUrl}/jobs/${jobSequence}/`;
};

export let getJobUniqueName = function (username: string,
                                        projectName: string,
                                        experimentSequence: number,
                                        jobSequence: number) {
  let experimentUrl = getExperimentUniqueName(username, projectName, experimentSequence);
  return `${experimentUrl}.${jobSequence}`;
};

export function getGroupName(projectName: string, groupSequence: number | string) {
  return `${projectName}.${groupSequence}`;
}

export function handleAuthError(response: any, dispatch: any) {
  if (!response.ok) {
    dispatch(fetchUser());
    return Promise.reject(response.statusText);
  }
  return response;
}

/*
  Convert an experiment unique name to an index by ignoring the group if it exists on the unique name.
*/
export function getExperimentIndexName(uniqueName: string): string {
  let values = uniqueName.split('.');
  if (values.length === 4) {
    values.splice(2, 1);
  }
  return values.join('.');
}

/*
  Convert a job unique name to an index by ignoring the group if it exists on the unique name, and task type.
*/
export function getJobIndexName(uniqueName: string): string {
  let values = uniqueName.split('.');
  if (values.length === 6) {
    values.splice(2, 1);
  }
  values.splice(4, 1);
  return values.join('.');
}

export function humanizeTimeDelta(startDate: string | Date, endtDate: string | Date): string | null {
  if (startDate == null || endtDate == null) {
    return null;
  }

  let seconds = moment(endtDate).diff(moment(startDate), 'seconds');
  let minutes = moment(endtDate).diff(moment(startDate), 'minutes');
  let hours = moment(endtDate).diff(moment(startDate), 'hours');
  let days = moment(endtDate).diff(moment(startDate), 'days');

  hours = hours % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;
  let result = '';

  if (days >= 1) {
    result += `${days}d`;
    if (hours >= 1) {
      result += ` ${hours}h`;
    }
    if (minutes >= 1) {
      result += ` ${minutes}m`;
    }
    return result;
  }

  if (hours >= 1) {
    result += `${hours}h`;
    if (hours >= 1) {
      result += ` ${minutes}m`;
    }
    return result;
  }

  if (minutes >= 1) {
    result = `${minutes}m`;
    if (seconds >= 1) {
      result += ` ${seconds}s`;
    }
    return result;
  }

  return `${seconds}s`;
}

export const delay = (ms?: number) => new Promise(resolve =>
  setTimeout(resolve, ms || 0)
);

export function b64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
