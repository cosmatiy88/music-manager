export const state = () => ({
  text: 'Processing...',
  icon: 'loading', // success || error || warning || loading
  color: 'black',
  show: false,
  auto: true,
})

export const mutations = {
  show: (state, body) => {
    if (!body) state.show = false
    else {
      const { text, icon, auto, color } = body
      state.text = text || 'Operation successfully.'
      state.icon = icon || 'success'
      state.auto = auto || false
      state.show = true
      state.color = color
    }
  },
  toggle(state, toggle) {
    state.show = toggle
  },
}

export const getters = {
  properties(state) {
    return {
      text: state.text,
      color: state.color,
      show: state.show,
      auto: state.auto,
    }
  },
}
