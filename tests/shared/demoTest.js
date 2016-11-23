import glob from 'glob'
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import MockDate from 'mockdate';

const skip = [
  'mention', // https://github.com/facebook/draft-js/issues/385
  'menu', // https://github.com/react-component/menu/issues/63
  'breadcrumb/demo/router', // https://github.com/ReactTraining/react-router/blob/master/docs/guides/ServerRendering.md#history-singletons,
];

export default function demoTest(component, options = {}) {
  let testMethod = options.skip ? test.skip : test;
  const files = glob.sync(`./components/${component}/demo/*.md`);

  files.forEach(file => {
    if (skip.some(c => file.includes(c))) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, () => {
      if (file.indexOf('date-picker/demo/locale.md') >= 0) {
        MockDate.set(new Date('2016-11-22').getTime());
      } else {
        MockDate.set(new Date('2016-11-22').getTime() + new Date().getTimezoneOffset() * 60 * 1000, 0);
      }
      const demo = require('../.' + file);
      const wrapper = render(demo);
      expect(renderToJson(wrapper)).toMatchSnapshot();
      MockDate.reset();
    });
  });
}
