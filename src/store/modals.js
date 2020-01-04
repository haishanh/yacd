export function openModal(modalName) {
  return dispatch => {
    dispatch(`openModal:${modalName}`, s => {
      s.modals[modalName] = true;
    });
  };
}

export function closeModal(modalName) {
  return dispatch => {
    dispatch(`closeModal:${modalName}`, s => {
      s.modals[modalName] = false;
    });
  };
}

export const initialState = { apiConfig: false };
