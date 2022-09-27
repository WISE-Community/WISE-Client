import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { NodeService } from '../../assets/wise5/services/nodeService';

interface MathJaxConfig {
  id: string;
  source: string;
}

declare global {
  interface Window {
    MathJax: {
      typesetPromise: () => void;
      startup: {
        promise: Promise<any>;
      };
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class MathService {
  private signal: Subject<boolean>;
  private mathJax: MathJaxConfig = {
    id: 'MathJaxScript',
    source: 'mathjax/es5/tex-mml-chtml.js'
  };

  constructor(private nodeService: NodeService) {
    this.signal = new ReplaySubject<boolean>();
    void this.registerMathJaxAsync(this.mathJax)
      .then(() => {
        this.signal.next();
      })
      .catch((error) => console.error(error));
    this.nodeService.doneRenderingComponent$.subscribe(() => this.renderPage());
  }

  private async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return new Promise((resolve: any, reject) => {
      const script: HTMLScriptElement = document.createElement('script');
      script.id = config.id;
      script.type = 'text/javascript';
      script.src = config.source;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  ready(): Observable<boolean> {
    return this.signal;
  }

  private renderPage(): void {
    window.MathJax.startup.promise.then(() => {
      window.MathJax.typesetPromise();
    });
  }
}
