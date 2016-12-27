import { AngularCLITestPage } from './app.po';

describe('angular-cli-test App', function() {
  let page: AngularCLITestPage;

  beforeEach(() => {
    page = new AngularCLITestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
