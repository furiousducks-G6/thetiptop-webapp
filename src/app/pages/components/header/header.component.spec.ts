import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({
        firstName: 'John',
        email: 'john@example.com'
      })),
      logout: jasmine.createSpy('logout').and.callFake(() => {})
    };

    userServiceMock = {
      userProfileUpdated$: of()  // Simule un Observable pour les mises à jour du profil
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load user profile', () => {
    expect(authServiceMock.getUserProfile).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.firstName).toBe('John');
    expect(component.email).toBe('john@example.com');
  });

  it('should toggle the user menu', () => {
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeTrue();

    component.toggleUserMenu();
    expect(component.showUserMenu).toBeFalse();
  });

  it('should check screen size and set isMobile to true for small screens', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);  // Simule un écran mobile
    component.checkScreenSize();
    expect(component.isMobile).toBeTrue();
  });

  it('should check screen size and set isMobile to false for large screens', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);  // Simule un écran desktop
    component.checkScreenSize();
    expect(component.isMobile).toBeFalse();
  });

  it('should toggle the burger menu visibility', () => {
    const menuElement = document.createElement('div');
    menuElement.id = 'menu';
    document.body.appendChild(menuElement);

    component.toggleMenu();
    expect(menuElement.classList.contains('hidden')).toBeFalse();  // Vérifie que le menu n'est plus caché

    component.toggleMenu();
    expect(menuElement.classList.contains('hidden')).toBeTrue();  // Vérifie que le menu est caché

    document.body.removeChild(menuElement);
  });

  it('should navigate to the correct section on scrollToSection', async () => {
    await component.scrollToSection('home');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], { fragment: 'home' });
  });

  it('should log out the user', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});
