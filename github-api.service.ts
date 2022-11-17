import { Injectable } from '@angular/core';
import { Octokit } from "octokit";
import { Observable, from } from 'rxjs';

const octokit = new Octokit({
  auth: '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'
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

  getUserProjects$(username: string): Observable<any>{
    return from(this.fetchUserProjects(username));
  }
}
