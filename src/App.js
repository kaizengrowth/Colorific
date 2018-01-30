import React, { Component } from 'react';
import store from 'store/configureStore.js';
import { Provider } from 'react-redux';
import PreviewList from 'components/previewList';
import Controls from 'components/controls';
import Chrome from 'components/chrome';
import SavedSwatches from 'components/savedSwatches';
import isElectron from 'utils/isElectron.js';
import style from  './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className={style.app}>
          {isElectron() ? (
            <Chrome />
          ) : undefined}
          
          <PreviewList />
          <SavedSwatches />
          <Controls />
        </div>
      </Provider>
    );
  }
}

export default App;
