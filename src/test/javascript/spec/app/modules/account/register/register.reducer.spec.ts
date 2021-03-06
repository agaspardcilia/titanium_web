import { expect } from 'chai';
import thunk from 'redux-thunk';
import axios from 'axios';
import * as sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import register, { ACTION_TYPES, handleRegister } from 'app/modules/account/register/register.reducer';

describe('Creating account tests', () => {
  const initialState = {
    loading: false,
    registrationSuccess: false,
    registrationFailure: false,
    errorMessage: null
  };

  it('should return the initial state', () => {
    expect(register(undefined, {})).to.eql({
      ...initialState
    });
  });

  it('should detect a request', () => {
    expect(register(undefined, { type: REQUEST(ACTION_TYPES.CREATE_ACCOUNT) })).to.eql({
      ...initialState,
      loading: true
    });
  });

  it('should handle RESET', () => {
    expect(
      register({ loading: true, registrationSuccess: true, registrationFailure: true, errorMessage: '' }, { type: ACTION_TYPES.RESET })
    ).to.eql({
      ...initialState
    });
  });

  it('should handle CREATE_ACCOUNT success', () => {
    expect(
      register(undefined, {
        type: SUCCESS(ACTION_TYPES.CREATE_ACCOUNT),
        payload: 'fake payload'
      })
    ).to.eql({
      ...initialState,
      registrationSuccess: true
    });
  });

  it('should handle CREATE_ACCOUNT failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      register(undefined, {
        type: FAILURE(ACTION_TYPES.CREATE_ACCOUNT),
        payload
      })
    ).to.eql({
      ...initialState,
      registrationFailure: true,
      errorMessage: payload.response.data.errorKey
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware()]);
      store = mockStore({});
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches CREATE_ACCOUNT_PENDING and CREATE_ACCOUNT_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_ACCOUNT)
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_ACCOUNT),
          payload: resolvedObject
        }
      ];
      await store.dispatch(handleRegister('', '', '')).then(() => expect(store.getActions()).to.eql(expectedActions));
    });
  });
});
