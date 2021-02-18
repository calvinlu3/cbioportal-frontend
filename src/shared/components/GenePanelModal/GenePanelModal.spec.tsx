import GenePanelModal from './GenePanelModal';
import React from 'react';
import { assert } from 'chai';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('GenePanelModal', () => {
    let wrapper: any;
    const props = {
        panelName: 'TESTPANEL1',
        show: true,
        onHide: () => {},
        isLoading: true,
    };

    after(() => {
        wrapper.unmount();
    });

    it('only renders modal body when isLoading is false', () => {
        wrapper = mount(<GenePanelModal {...props} />);
        assert.equal(
            wrapper.find('[data-test="gene-panel-modal-body"]').length,
            0
        );

        wrapper.unmount();
        wrapper = mount(<GenePanelModal {...props} isLoading={false} />);
        assert(
            wrapper.find('[data-test="gene-panel-modal-body"]').length === 1
        );
    });

    it('renders panel modal name', () => {
        const panelTitle = wrapper
            .find('[data-test="gene-panel-modal-title"]')
            .at(0);
        assert(panelTitle.text().includes('TESTPANEL1'));
    });
});
