/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { assert } from 'chai';
import { ConfigureComponent } from './configure.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

let fixture: ComponentFixture<ConfigureComponent>;

describe('Configure component', () => {
    //beforeEach(() => {
    //    TestBed.configureTestingModule({ declarations: [ConfigureComponent] });
    //    fixture = TestBed.createComponent(ConfigureComponent);
    //    fixture.detectChanges();
    //});

    //it('should display a title', async(() => {
    //    const titleText = fixture.nativeElement.querySelector('h1').textContent;
    //    expect(titleText).toEqual('Configure');
    //}));

    //it('should start with count 0, then increments by 1 when clicked', async(() => {
    //    const countElement = fixture.nativeElement.querySelector('strong');
    //    expect(countElement.textContent).toEqual('0');

    //    const incrementButton = fixture.nativeElement.querySelector('button');
    //    incrementButton.click();
    //    fixture.detectChanges();
    //    expect(countElement.textContent).toEqual('1');
    //}));
});
