import { Component, OnInit, HostListener, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isMobile: boolean = false;
  currentSection: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    const menu = document.getElementById('menu');
    if (menu && !this.isMobile) {
      menu.classList.add('hidden');
    }
  }

  toggleMenu(): void {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  }

  scrollToSection(section: string): void {
    this.router.navigate(['/home'], { fragment: section }).then(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });
  }
}
