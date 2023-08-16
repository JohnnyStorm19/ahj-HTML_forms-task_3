import WidgetController from './components/Controller';


const container = document.querySelector('.container');
const widgetController = new WidgetController(container);
widgetController.bindToDOM();

