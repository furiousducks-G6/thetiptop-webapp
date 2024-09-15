import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { FormsModule } from '@angular/forms'; // Importation de FormsModule
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import axios from 'axios'; // Assurez-vous d'importer axios ici
import { fakeAsync, tick } from '@angular/core/testing';
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let routerMock: any;
  let viewportScrollerMock: any;

  beforeEach(async () => {
    routerMock = {
      events: of(new NavigationEnd(0, '', '')) // Importation correcte de NavigationEnd
    };

    viewportScrollerMock = {
      scrollToAnchor: jasmine.createSpy('scrollToAnchor')
    };

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [HttpClientTestingModule, FormsModule], // Ajout de FormsModule ici
      providers: [
        { provide: ViewportScroller, useValue: viewportScrollerMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' } // Spécifier que le test s'exécute dans un environnement de navigateur
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to section', () => {
    component.scrollToSection('home');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('home');
    expect(component.currentSection).toBe('home');
  });

  it('should validate email correctly', () => {
    expect(component.isValidEmail('test@example.com')).toBeTrue();
    expect(component.isValidEmail('invalid-email')).toBeFalse();
  });

  it('should not subscribe with invalid email', () => {
    component.email = 'invalid-email';
    spyOn(component, 'showNotificationMessage');
    component.subscribeToNewsletter();
    expect(component.showNotificationMessage).toHaveBeenCalledWith('Veuillez entrer une adresse e-mail valide.', 'error');
  });

  it('should show success message after valid subscription', (done) => {
    spyOn(axios, 'post').and.returnValue(Promise.resolve({ status: 200 }));
    spyOn(component, 'showNotificationMessage');

    component.email = 'test@example.com';
    component.subscribeToNewsletter();

    setTimeout(() => {
      expect(component.showNotificationMessage).toHaveBeenCalledWith('Merci pour votre inscription à notre newsletter!', 'success');
      done();
    }, 100);
  });

  it('should show error message on subscription failure', (done) => {
    spyOn(axios, 'post').and.returnValue(Promise.reject({}));
    spyOn(component, 'showNotificationMessage');

    component.email = 'test@example.com';
    component.subscribeToNewsletter();

    setTimeout(() => {
      expect(component.showNotificationMessage).toHaveBeenCalledWith('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.', 'error');
      done();
    }, 100);
  });

  it('should hide notification after 5 seconds', fakeAsync(() => {
    component.showNotificationMessage('Test Message', 'success');
    expect(component.showNotification).toBeTrue();
  
    // Simule le passage de 5 secondes
    tick(5000);
  
    expect(component.showNotification).toBeFalse();
  }));
});
