import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoRichTextBodyComponent } from './po-rich-text-body.component';

describe('PoRichTextBodyComponent:', () => {
  let component: PoRichTextBodyComponent;
  let fixture: ComponentFixture<PoRichTextBodyComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoRichTextBodyComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {

    it('onInit: should update `bodyElement`', () => {
      const expectedValue = 'on';
      component.ngOnInit();

      expect(component.bodyElement.nativeElement.designMode).toEqual(expectedValue);
    });

    it('onInit: should call `updateValueWithModelValue`', fakeAsync(() => {
      spyOn(component, <any>'updateValueWithModelValue');

      component.ngOnInit();
      tick(50);

      expect(component['updateValueWithModelValue']).toHaveBeenCalled();
    }));

    describe('executeCommand:', () => {

      it('should call `focus`', () => {
        const spyFocus = spyOn(component.bodyElement.nativeElement, <any>'focus');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyFocus).toHaveBeenCalled();
      });

      it('should call `execCommand` with string as parameter.', () => {
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue, false, null);
      });

      it('should call `execCommand` with object as parameter.', () => {
        const command = 'foreColor';
        const value = '#000000';
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = { command, value };

        spyOn(component, <any>'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue.command, false, fakeValue.value);
        expect(component['handleCommandLink']).not.toHaveBeenCalled();
      });

      it('should call `handleCommandLink` with an object as parameter if command value is `InsertHTML`.', () => {
        const command = 'InsertHTML';
        const value = { urlLink: 'link', urlLinkText: 'link text' };
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = { command, value };

        spyOn(component, <any>'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(component['handleCommandLink']).toHaveBeenCalledWith(command, value.urlLink, value.urlLinkText);
        expect(spyExecCommand).not.toHaveBeenCalled();
      });

      it('should call `updateModel`', () => {
        const fakeValue = 'p';
        spyOn(component, <any>'updateModel');

        component.executeCommand(fakeValue);

        expect(component['updateModel']).toHaveBeenCalled();
      });

      it('should call `value.emit` with `modelValue`', () => {
        component.modelValue = 'teste';
        const fakeValue = 'p';

        spyOn(component.value, 'emit');
        component.executeCommand(fakeValue);

        expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
      });

    });

    it('focus: should call `focus` of rich-text', () => {

      spyOn(component.bodyElement.nativeElement, 'focus');

      component.focus();

      expect(component.bodyElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('onClick: should call `emitSelectionCommands`', () => {
      spyOn(component, <any>'emitSelectionCommands');
      component.onClick();

      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onKeyUp: should call `toggleCursorOnLink` with `event` and `remove` before `updateModel`', () => {
      spyOn(component, <any>'toggleCursorOnLink');
      const updateModelSpy = spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(component['toggleCursorOnLink']).toHaveBeenCalledBefore(updateModelSpy);
    });

    it('onKeyUp: should call `removeBrElement` and `emitSelectionCommands`', () => {
      spyOn(component, <any>'toggleCursorOnLink');
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onPaste: should call `addClickListenerOnAnchorElements` and `update`', () => {
      spyOn(component, <any>'addClickListenerOnAnchorElements');
      spyOn(component, <any>'update');

      component.onPaste();

      expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
      expect(component['update']).toHaveBeenCalled();
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `76` and ctrlKey is `true`', () => {
      const fakeEvent = {
        keyCode: 76,
        ctrlKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: should call `toggleCursorOnLink` with `event` and `add`', () => {
      const fakeEvent = {
        ctrlKey: false
      };

      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(component['toggleCursorOnLink']).toHaveBeenCalledWith(fakeEvent, 'add');
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `76` and metaKey is `true`', () => {
      const fakeEvent = {
        keyCode: 76,
        metaKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if keyCode isn`t `76`', () => {
      const fakeEvent = {
        keyCode: 18,
        cmdKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if ctrlKey isn`t true', () => {
      const fakeEvent = {
        keyCode: 76,
        ctrlKey: false,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it(`addClickListenerOnAnchorElements: should call 'addEventListener' with 'click' and 'onAnchorClick'
      based on the amount of anchor elements`, () => {

      const spyListener = jasmine.createSpy('addEventListener');

      const anchors = [
        { parentNode: `<a>link1</a>`, addEventListener: spyListener },
        { parentNode: `<a>link2</a>`, addEventListener: spyListener },
        { parentNode: `<a>link3</a>`, addEventListener: spyListener },
      ];

      spyOn(component.bodyElement.nativeElement, 'querySelectorAll').and.returnValue(<any>anchors);

      component['addClickListenerOnAnchorElements']();

      expect(spyListener).toHaveBeenCalledTimes(anchors.length);
      expect(spyListener).toHaveBeenCalledWith('click', component['onAnchorClick']);
    });

    it('isCursorPositionedInALink: should return true if tag element is a link', () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'A' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is IE and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if not tag A, firefox and IE, but 'isParentNodeAnchor' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(false);
      spyOn(component, <any>'isParentNodeAnchor').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return false if not tag A, firefox, IE  and 'isParentNodeAnchor' return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(false);
      spyOn(component, <any>'isParentNodeAnchor').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {

      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is IE and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {

      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it('update: should call `updateModel`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['updateModel']).toHaveBeenCalled();
    }));

    it('update: should call `removeBrElement` and `emitSelectionCommands`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    }));

    it('emitSelectionCommands: should call `commands.emit`', () => {
      spyOn(component.commands, 'emit');
      spyOn(component, <any>'isCursorPositionedInALink');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalled();
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {

      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: ['Createlink'], hexColor: 'hex'});
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {

      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: ['Createlink'], hexColor: 'hex'});
    });

    it(`emitSelectionCommands: should call 'commands.emit' with 'hexColor' undefined if browser is IE`, () => {

      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(UtilsFunction, 'isIE').and.returnValue(true);
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: ['Createlink'], hexColor: undefined });
    });

    it(`emitSelectionCommands: the object property 'commands'
    shouldn't contain 'Createlink' if 'isCursorPositionedInALink' returns 'false'`, () => {

      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(false);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: [], hexColor: 'hex'});
    });

    it('handleCommandLink: should call `insertHtmlLinkElement` if isIE returns `true`', () => {
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(true);
      spyOn(component, <any>'insertHtmlLinkElement');
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).not.toHaveBeenCalled();
      expect(UtilsFunction.isIE).toHaveBeenCalled();
      expect(component['insertHtmlLinkElement']).toHaveBeenCalledWith(fakeValue.urlLink, fakeValue.urlLinkText);
    });

    it('handleCommandLink: should call `document.execCommand` with `command`, `false` and linkValue as params if isIE is `false`', () => {
      const linkValue = `<a class="po-rich-text-link" href="urlLink" target="_blank">url link text</a>`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(component, <any>'insertHtmlLinkElement');
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, linkValue);
      expect(component['insertHtmlLinkElement']).not.toHaveBeenCalled();
    });

    it(`handleCommandLink: the parameter 'linkvalue' should be concatenated with 'urlLink' if 'urlLinkText' is undefined`, () => {
      const linkValue = `<a class="po-rich-text-link" href="urlLink" target="_blank">urlLink</a>`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: undefined
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, linkValue);
    });

    it(`handleCommandLink: should add '&nbsp;' at beginning and end of 'linkValue' if 'isFirefox'`, () => {
      const expectedLinkValue = `&nbsp;<a class="po-rich-text-link" href="urlLink" target="_blank">urlLink</a>&nbsp;`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: undefined
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, expectedLinkValue);
    });

    it('handleCommandLink: should call `addClickListenerOnAnchorElements`', () => {
      spyOn(component, <any>'addClickListenerOnAnchorElements');

      component['handleCommandLink']('CreateLink', 'link text', 'link url');

      expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
    });

    it('updateModel: should update `modelValue`', () => {
      component.bodyElement.nativeElement.innerHTML = 'teste';
      component['updateModel']();
      fixture.detectChanges();
      expect(component.modelValue).toContain('teste');
    });

    it('updateModel: should call `value.emit` with `modelValue`', () => {
      component.modelValue = 'teste';

      spyOn(component.value, 'emit');
      component['updateModel']();

      expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
    });

    it('updateValueWithModelValue: should call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = 'teste';

      spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).toHaveBeenCalledWith('afterbegin', component.modelValue);
    });

    it('onFocus: should set a value to `valueBeforeChange`', () => {
      component.modelValue = 'value';

      component.onFocus();

      expect(component['valueBeforeChange']).toBe('value');
    });

    it('rgbToHex: should return the hexadecimal value`', () => {
      const rbg = 'rgb(0, 128, 255)';
      const hex = '#0080ff';
      const result = component['rgbToHex'](rbg);

      expect(result).toBe(hex);
    });

    it('toggleCursorOnLink: should call remove of classList if `action` is remove, `element` is `anchor` and `key` is `ctrl`', () => {
      const event = { ctrlKey: true };

      const removeSpy = jasmine.createSpy('remove');

      spyOn(document , 'getSelection').and.returnValue(<any>{
        focusNode : {
          parentNode: {
            nodeName: 'A',
            classList: {
              remove: removeSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'remove');

      expect(removeSpy).toHaveBeenCalledWith('po-clickable');
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `ctrl`', () => {
      const event = { ctrlKey: true };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any> 'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document , 'getSelection').and.returnValue(<any>{
        focusNode : {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `metaKey`', () => {
      const event = { metaKey: true };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any> 'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document , 'getSelection').and.returnValue(<any>{
        focusNode : {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `Control`', () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any> 'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document , 'getSelection').and.returnValue(<any>{
        focusNode : {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it(`toggleCursorOnLink: shouldn't call add and call remove of classList if 'element' not is 'anchor'`, () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any> 'isCursorPositionedInALink').and.returnValue(false);
      const removeSpy = jasmine.createSpy('remove');

      spyOn(document , 'getSelection').and.returnValue(<any>{
        focusNode : {
          parentNode: {
            nodeName: 'DIV',
            classList: {
              add: addSpy,
              remove: removeSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(removeSpy).toHaveBeenCalled();
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
      expect(addSpy).not.toHaveBeenCalled();
    });

    it('onAnchorClick: should `openExternalLink` with url if key is `ctrlKey`', () => {
      const url = 'http://test.com';

      const event = {
        ctrlKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(url);
    });

    it('onAnchorClick: should remove `po-clickable` if key is `ctrlKey`', () => {
      const url = 'http://test.com';

      const event = {
        ctrlKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');
      spyOn(event.target.classList, 'remove');

      component['onAnchorClick'](event);

      expect(event.target.classList.remove).toHaveBeenCalledWith('po-clickable');
    });

    it('onAnchorClick: should `openExternalLink` with url if key is `metaKey`', () => {
      const url = 'http://test.com';

      const event = {
        metaKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(url);
    });

    it('onAnchorClick: shouldn`t `openExternalLink` if key not is ctrlKey or metaKey', () => {
      const url = 'http://test.com';

      const event = {
        enter: 'true',
        target: {
          attributes: { href: { value: url } }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).not.toHaveBeenCalled();
    });

    it('removeBrElement: should remove tag `br`', () => {
      const element = document.createElement('br');
      element.classList.add('teste');

      component.bodyElement.nativeElement.appendChild(element);

      component['removeBrElement']();

      expect(nativeElement.querySelector('.teste')).toBeFalsy();
    });

    it('removeBrElement: should`t remove tag `br`', () => {
      const div = document.createElement('div');
      const br = document.createElement('br');

      br.classList.add('teste-br');
      div.classList.add('teste-div');

      component.bodyElement.nativeElement.appendChild(div);
      component.bodyElement.nativeElement.appendChild(br);

      component['removeBrElement']();

      expect(nativeElement.querySelector('.teste-br')).toBeTruthy();
      expect(nativeElement.querySelector('.teste-div')).toBeTruthy();
    });

    it('onBlur: should emit modelValue change', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: '1',
        change: component.change,
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.modelValue);
    }));

    it('onBlur: shouldn`t emit change value doesn`t changed', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: 'value',
        change: {
          emit: () => {}
        },
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

    it('insertHtmlLinkElement: should contain `po-rich-text-link`', () => {
      const urlLink = 'urlLink';
      const urlLinkText = 'url link text';

      component.focus();

      component['insertHtmlLinkElement'](urlLink, urlLinkText);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-rich-text-link')).toBeTruthy();
    });

    it('isParentNodeAnchor: should return true if focusNode.parentElement if anchor element', () => {
      const textSelection = {
        focusNode: {
          parentElement: {
            tagName: 'A'
          }
        }
      };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any> textSelection);

      expect(isParentNodeAnchor).toBe(true);
      expect(component['linkElement']).toEqual(textSelection.focusNode.parentElement);
    });

    it('isParentNodeAnchor: should return true if parentElement of focusNode.parentElement if anchor element', () => {
      const parentElement = {
        tagName : 'A'
      };

      const textSelection = {
        focusNode: {
          parentElement: {
            tagName: 'DIV',
            parentElement
          }
        }
      };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any> textSelection);

      expect(isParentNodeAnchor).toBe(true);
      expect(component['linkElement']).toEqual(textSelection.focusNode.parentElement.parentElement);
    });

    it('isParentNodeAnchor: should return false and set linkElement to undefined', () => {
      const textSelection = {
        focusNode: {
          parentElement: {
            tagName: ''
          }
        }
      };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any> textSelection);

      expect(isParentNodeAnchor).toBe(false);
      expect(component['linkElement']).toBeUndefined();
    });

    it('isParentNodeAnchor: should return falsy if textSelection is undefined', () => {
      const textSelection = undefined;

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any> textSelection);

      expect(isParentNodeAnchor).toBeFalsy();
    });

  });

  describe('Templates:', () => {

    it('should contain `po-rich-text-body`', () => {

      expect(nativeElement.querySelector('.po-rich-text-body')).toBeTruthy();
    });

  });

});
