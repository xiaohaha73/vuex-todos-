import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [], // 该做的事情的数据列表
    input_value: '', // 定义一个输入框的默认值
    next_id: 0, // 定义一个list新增加的元素的id值
    button_key: 'all' // 默认将按钮状态设置为显示全部
  },
  mutations: {
    // 加载初始备忘录的数据列表
    load_data: function (state, data) {
      state.list = data.list
    },

    // 改变输入框对应的state的input_value值的函数
    change_input: function (state, data) {
      state.input_value = data
    },

    // 将新的input_value添加到list中
    submit_data: function (state) {
      // 初始化一下next_id的值
      state.next_id = state.list.length
      // 定义一个新的事件对象
      const thing = {
        id: state.next_id,
        info: state.input_value.trim(),
        done: false
      }
      // 添加到list数组中
      state.list.push(thing)
      state.input_value = ''
    },

    // 删除操作的函数
    delete_data: function (state, id) {
      const tId = state.list.findIndex((item) => {
        return item.id === id
      })
      if (tId !== -1) {
        // 存在这个索引值就将这个索引值对应的数组删除掉
        state.list.splice(tId, 1)
      }
    },

    // 更改checked状态的函数
    checkChange: function (state, id) {
      const target = state.list.find((item) => {
        return item.id === id
      })
      // console.log(target)
      target.done = !target.done
    },

    // 清除已经完成的事情
    clear_done: function (state) {
      state.list = state.list.filter((item) => item.done === false)
    },

    // 切换底部三个按钮的状态
    button_state: function (state, key) {
      state.button_key = key
    }
  },
  actions: {
    // 定义一个使用axios请求数据的函数
    get_data: function (context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('load_data', data) // 将加载回来的数据使用mutations中的方法传回
      })
    }
  },
  getters: {
    // 筛选出还有多少事情没有做
    show_todos: function (state) {
      return state.list.filter((item) => item.done === false).length
    },

    // 筛选出未做，已做和全部的数据的数组
    show_list: function (state) {
      // 判断三种状态栏，分情况输出数组
      if (state.button_key === 'all') {
        // 全部展示的情况
        return state.list
      } else if (state.button_key === 'do') {
        // 已经完成的情况
        return state.list.filter((item) => item.done === false)
      } else {
        // 未完成的情况
        return state.list.filter((item) => item.done === true)
      }
    }
  },
  modules: {}
})
