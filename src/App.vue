<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" :value="input_value" @change="input_handle" @keyup="enter_handle"/>
    <a-button type="primary" @click="submit_handle">添加事项</a-button>

    <a-list bordered :dataSource="show_list" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked="item.done" @change="check_handle(item.id)">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="delete_handle(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{show_todos}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="button_key === 'all'? 'primary' : 'default'" @click="button_state('all')">全部</a-button>
          <a-button :type="button_key === 'do'? 'primary' : 'default'" @click="button_state('do')">未完成</a-button>
          <a-button :type="button_key === 'done'? 'primary' : 'default'" @click="button_state('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clear_done">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {}
  },
  methods: {
    input_handle: function (e) {
      // 调用mutations中的函数将state对应的公共数据进行改变
      this.$store.commit('change_input', e.target.value)
    },
    // 回车键添加备忘录事件的函数
    enter_handle: function (e) {
      if (e.keyCode === 13) {
      // 调用上传备忘录事件的函数
        this.submit_handle()
      }
    },

    // 提交新的备忘录事件的触发函数
    submit_handle: function () {
      // 先判断一下输入框的内容是否为空
      if (this.input_value.trim().length === 0) {
        // 内容为空的情况给出一个提示信息
        return this.$message.warning('输入框内容不能为空 !')
      }
      this.$store.commit('submit_data')
    },

    // 删除事件的操作函数
    delete_handle: function (id) {
      this.$store.commit('delete_data', id)
    },

    // 实现选中功能的函数
    check_handle: function (id) {
      // console.log(id)
      // 调用mutations更改数据

      this.$store.commit('checkChange', id)
    },

    // 清除已经完成的事件的函数
    clear_done: function () {
      // 调用mutations中定义的方法进行清除
      this.$store.commit('clear_done')
    },

    // 切换底部三个按钮的函数
    button_state: function (key) {
      this.$store.commit('button_state', key)
    }
  },
  created () {
    // 生成初始化的列表数据,调用store里面的actions中定义好的异步函数加载数据
    this.$store.dispatch('get_data')
  },

  computed: {
    ...mapState(['list', 'input_value', 'button_key']),
    ...mapGetters(['show_todos', 'show_list'])
  }
}

</script>

<style scoped>
  #app {
    padding: 10px;
    margin: 100px auto;
    width: 500px;
  }

  .my_ipt {
    width: 500px;
    margin-right: 10px;
  }

  .dt_list {
    width: 500px;
    margin-top: 10px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
