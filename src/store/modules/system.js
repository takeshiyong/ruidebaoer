const system = {
    state: {
        tagsList: [], // tagsList(顶部标签页)
        menuList: [],//  menuList(左侧菜单)
        docHeight: 0,//动态计算窗体高度
        docWidth: 0, //动态计算窗体宽度
    },
    mutations: {
        // tagsList
        SET_TAGSLIST: (state, res) => {
            state.tagsList = res;
        },
        // menuList
        SET_MENULIST: (state, res) => {
            state.menuList = res;
        },
        SET_DOCHEIGHT: (state, res, res1) => {
            state.docHeight = res.height;
            state.docWidth = res.width;
        },
    },
    actions: {
        // tagsList
        setTagsList: ({ commit }, obj) => {
            commit('SET_TAGSLIST', obj)
        },
        // menuList
        setMenuList: ({ commit }, obj) => {
            commit('SET_MENULIST', obj)
        },
    },
};
export default system;
