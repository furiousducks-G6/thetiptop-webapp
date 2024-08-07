import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentSection: string = 'home';
  private isBrowser: boolean;

  constructor(private viewportScroller: ViewportScroller, private router: Router, @Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentSection();
      }
    });
  }

  scrollToSection(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
    this.currentSection = sectionId;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser) {
      this.updateCurrentSection();
    }
  }

  private updateCurrentSection() {
    if (this.isBrowser) {
      const sections = ['home', 'lots', 'jeux', 'contact'];
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom > 0) {
            this.currentSection = section;
            return;
          }
        }
      }
    }
  }
}
