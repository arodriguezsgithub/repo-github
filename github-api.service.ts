import { Injectable } from '@angular/core';
import { Octokit } from "octokit";
import { Observable, from } from 'rxjs';

export interface Project {
  name: string;
  url: string;
  created_at: string;
  id: number;
}

const octokit = new Octokit({
  auth: atob('Z2l0aHViX3BhdF8xMUFRWTQzQ0Ewd1NmOUpTNkpBN0tiX0RJSVJXdFdyTmtpY0ZzQUVLZ3lUdnZCVVJ3N0VOUU8wZ1hzRzI3Wmc5d05RN0tDMlRLQ3ZlSVIwaEZD')
});

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  constructor() { }

  private async fetchUserProjects(username: string): Promise<any>{
    try {
      const result = await octokit.request('GET /users/{username}/repos', {
        username: username
      });
  
      const projects = result.data.map(project => 
        ({
          name: project.name, 
          url: project.url,
          created_at: project.created_at ? project.created_at : '',
          id: project.id
        })
      )
  
      return projects;
  
    } catch (error: any) {
      return new Error(error);
    }
  }

  private async fetchProject(username: string, reponame: string): Promise<any>{
    try {
      const result = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: username,
        repo: reponame
      })
  
      const project: Project = {
        name: result.data.name, 
        url: result.data.url,
        created_at: result.data.created_at ? result.data.created_at : '',
        id: result.data.id
      }

      return project;
  
    } catch (error: any) {
      return new Error(error);
    }
  }

  getUserProjects$(username: string): Observable<Project[]>{
    return from(this.fetchUserProjects(username));
  }

  getProject$(username: string, reponame: string): Observable<Project>{
    return from(this.fetchProject(username, reponame));
  }
  
}
