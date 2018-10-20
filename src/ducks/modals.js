const OpenModal = 'modals/OpenModal';
const CloseModal = 'modals/CloseModal';

export function openModal(modalName) {
  return {
    type: OpenModal,
    payload: modalName
  };
}

export function closeModal(modalName) {
  return {
    type: CloseModal,
    payload: modalName
  };
}

const initialState = {
  apiConfig: false
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case OpenModal:
      return { ...initialState, [payload]: true };
    case CloseModal:
      return { ...initialState, [payload]: false };
    default:
      return state;
  }
}
