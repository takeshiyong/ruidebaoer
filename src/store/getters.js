const getters = {
    tagsList: state => state.system.tagsList,
    menuList: state => state.system.menuList,
    alarmInfor: state => state.system.alarmInfor,
    docHeight: state => state.system.docHeight,
    docWidth: state => state.system.docWidth,
    resourceUrl: state => state.system.resourceUrl, 
};
export default getters;
