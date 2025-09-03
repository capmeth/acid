import Catalog from '../components/core/page/Catalog'
import Component from '../components/core/page/Component'
import Document from '../components/core/page/Document'
// import Error from '../components/core/page/Error'
import Home from '../components/core/page/Home'
import Section from '../components/core/page/Section'


export default
[
    { name: 'home', path: '/home', Component: Home },
    { name: 'section', path: '/section/:sect', Component: Section },
    { name: 'document', path: '/document/:uid', Component: Document },
    { name: 'component', path: '/component/:uid', Component: Component },
    { name: 'catalog', path: '/catalog', Component: Catalog },
    // { name: 'error', path: '/error', Component: Error },
];
