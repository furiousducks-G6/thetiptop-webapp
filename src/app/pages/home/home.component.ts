import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  angle: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isMobile: boolean = false;

  reviews: { text: string; name: string; date: string; rating: number }[] = [
    { text: "J'ai vraiment eu ma part. Le jeu est vraiment fiable et ils donnent les gains.", name: "Serge", date: "12/06/2024", rating: 4 },
    { text: "J'ai eu ma part mais le service est un peu lent.", name: "George", date: "11/06/2024", rating: 3 },
    { text: "Tout est parfait, service rapide, jeux impeccables.", name: "Yve", date: "09/06/2024", rating: 5 },
    { text: "J'ai vraiment eu ma part. Le jeu est vraiment fiable et ils donnent les gains.", name: "Arnaud", date: "26/06/2024", rating: 4 },
    { text: "Très bon jeu, je recommande.", name: "Juliette", date: "02/07/2024", rating: 4 },
    { text: "J'adore ce jeu, il est vraiment amusant et les gains sont réels.", name: "Marcel", date: "14/07/2024", rating: 5 },
    { text: "Jeu fantastique, service rapide.", name: "Lucie", date: "28/07/2024", rating: 5 },
  ];

  visibleReviews: { text: string; name: string; date: string; rating: number }[] = [];

  currentPage: number = 0;

  reviewsPerPage: number = 4;

  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.checkScreenSize();
      this.pages = Array.from({ length: Math.ceil(this.reviews.length / this.reviewsPerPage) }, (_, i) => i + 1);
      this.setCurrentPage(1);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.startConfetti();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.isBrowser()) {
      this.checkScreenSize();
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  scrollCarousel(direction: string) {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth; // Amount to scroll

    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.reviewsPerPage;
    this.visibleReviews = this.reviews.slice(startIndex, startIndex + this.reviewsPerPage);
    if (this.visibleReviews.length < this.reviewsPerPage) {
      this.visibleReviews = this.visibleReviews.concat(this.reviews.slice(0, this.reviewsPerPage - this.visibleReviews.length));
    }
  }

  private startConfetti(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const confetti = document.getElementById('confetti') as HTMLCanvasElement;
    const ctx = confetti.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null');
      return;
    }

    confetti.width = window.innerWidth;
    confetti.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 100;
    const colors = ['#f3e5ab', '#e6d8af', '#ff6384', '#36a2eb', '#ffce56'];

    function createParticle(): Particle {
      return {
        x: Math.random() * confetti.width,
        y: Math.random() * confetti.height,
        size: Math.random() * 5 + 5, // Augmenter la taille des particules
        speed: Math.random() * 3 + 1, // Réduire la vitesse pour les rendre plus visibles
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 2 * Math.PI
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    function drawParticles() {
      if (!ctx) return; // Additional null check

      ctx.clearRect(0, 0, confetti.width, confetti.height);
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        if (particle.x < 0 || particle.x > confetti.width || particle.y < 0 || particle.y > confetti.height) {
          Object.assign(particle, createParticle());
        }
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }
}
