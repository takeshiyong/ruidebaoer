/*
 * @Author: 杨高杰
 * @Description:   api封装：
 */
import req from '@/utils/request';
// 1.课程标签
export const CourseService = {
    // 新加标签
    addlabel: (params) => req.post('/college-service/label/insert', params),
    //标签表格
    lablelist: (params) => req.post('/college-service/label/page/selectListByCondition', params),
    //删除标签
    deletelable: param => req.post(`/college-service/label/deleteById/${param}`),
    //编辑标签
    editlable: param => req.get(`/college-service/label/selectOne/${param}`),
    //确定编辑
    updatelable: (params) => req.post('/college-service/label/update', params),
}
//2.课程分类管理
export const CoursecateService = {
    //课程分类表格
    catelist: (params) => req.post('/college-service/courseType/page/selectListByCondition', params),
    //新加课程分类
    addcate: (params) => req.post('/college-service/courseType/insert', params),
    //编辑分类
    editcate: param => req.get(`/college-service/courseType/selectOne/${param}`),
    //删除分类
    deletecate: param => req.post(`/college-service/courseType/deleteById/${param}`),
    //点击确定
    updatecate: (params) => req.post('/college-service/courseType/update', params),
}
//3.课程课件相关
export const CoursefeilService = {
    //查询所有课程分类
    coursecate: (params) => req.post('/college-service/courseType/selectListByCondition', params),
    //查询所有课程标签
    courselable: (params) => req.post('/college-service/label/selectListByCondition', params),
    //分页查询所有课程
    courselist: (params) => req.post('/college-service/courseManagement/page/selectListByCondition', params),
    //新增课程
    addcourse: (params) => req.post('/college-service/courseManagement/insert', params),
    //删除课程
    deletecourse: param => req.post(`/college-service/courseManagement/deleteById/${param}`),
    //查询编辑课程
    findcourse: (params) => req.post('/college-service/courseManagement/selectListByCondition', params),
    //编辑课程
    updatecourse: (params) => req.post('/college-service/courseManagement/update', params),
    //查看详情
    couesedetail: param => req.get(`/college-service/courseManagement/selectDetails/${param}`),
    //新增章节
    coursezj: (params) => req.post('/college-service/chapterManagement/insert', params),
    //删除章节
    deleatzj: param => req.post(`/college-service/chapterManagement/deleteById/${param}`),
    //删除节点
    deleatjd: param => req.post(`/college-service/coursewareManagement/deleteById/${param}`),
    //新建节点
    addjd: (params) => req.post('/college-service/coursewareManagement/insert', params),
    //查询所有课件
    allfile: param => req.post(`/college-service/coursewareManagement/selectAllFile/${param}`),
    //保存视频文件
    keepvideo: (params) => req.post('/college-service/coursewareManagement/saveCoursewareShowFile', params),
    //保存附件
    keepwj: (params) => req.post('/college-service/coursewareManagement/saveCoursewareEnclosureFile', params),
    //发布课程
    publishcourse: (params) => req.post('/college-service/courseManagement/isPublish', params),
    //推荐课程
    isrecommendcourse: (params) => req.post('/college-service/courseRecommend/isRecommend', params),
    //获取推荐课程list
    isrecommendlist: (params) => req.post('/college-service/courseRecommend/page/selectList', params),
    //置顶推荐
    istop: param => req.post(`/college-service/courseRecommend/topRecommend/${param}`),
    //编辑章节
    ediozj: (params) => req.post('/college-service/chapterManagement/update', params),
    //编辑节点
    ediojd: (params) => req.post('/college-service/coursewareManagement/update', params),
    //删除视频和附件
    deleteFile: param => req.post(`/college-service/coursewareManagement/deleteCoursewareFile/${param}`),
}

//4. 试题管理
export const QuestionsService = {
    //分页查询设备
    getQuestionsDataByPage: (params) => req.post('/college-service/subject/selectByPage', params),

    //查询课程
    getCoursesData: (params = {}) => req.post('/college-service/courseManagement/selectListByCondition', params),

    //添加题目
    insertQuestionRecord: (params) => req.post('/college-service/subject/add', params),

    //编辑题目
    updateQuestionRecord: (params) => req.post('/college-service/subject/update', params),

    //获取题目详情
    getQuestionRecordDetails: (fId) => req.get(`/college-service/subject/selectDetail/${fId}`),

    //删除题目
    deleteSubjectRecords: (params) => req.post('/college-service/subject/deleteBatch', params),
};

//5. 试卷管理
export const ExamPaperService = {
    //查询试卷
    getExamRecords: (params) => req.post('/college-service/examinationPaper/select', params),

    //查询课程
    getCoursesData: (params = {}) => req.post('/college-service/courseManagement/selectListByCondition', params),

    //按照课程id, 查询题目
    getQuestionsData: (params) => req.post('/college-service/subject/selectForExam', params),

    //添加试卷
    insertExamPaper: (params) => req.post('/college-service/examinationPaper/add', params),

    //更新试卷
    updateExamPaper: (params) => req.post('/college-service/examinationPaper/update', params),

    //删除试卷
    deleteExamPapers: (params) => req.post('/college-service/examinationPaper/deleteBatch', params),

    //获取试卷详情
    getExamPaperDetails: (fId) => req.get(`/college-service/examinationPaper/selectExamPaperDetail/${fId}`),
};

//6. 培训记录
export const TrainingsService = {
    //获取培训类型
    getTrainingTypes: () => req.get('/college-service/TTrainType/selectAll'),

    //获取所有的人员
    getPersonnel: () => req.get('/user-service/employee/selectall'),

    //查询试卷
    getTrainingRecords: (params) => req.post('/college-service/trainplan/selectByPage', params),

    //获取培训详情
    getDetailedTrainingRecord: (fId) => req.get(`/college-service/trainplan/selectTrainDetail/${fId}`),

    //获取参加培训的人员
    getAttendingEmployees: (fTrainPlanId) => req.get(`/college-service/TrainProgress/selectTrainProgressByPlaneId/${fTrainPlanId}`),

    //查询课程
    getCourses: (params = {}) => req.post('/college-service/courseManagement/selectListByCondition', params),
};

//7. 培训类型
export const TrainingTypesService = {
    //获取所有培训类型
    getTrainingTypes: () => req.get('/college-service/TTrainType/selectAll'),

    //添加培训类型
    insertTrainType: (params) => req.post('/college-service/TTrainType/insertTTrainType', params),

    //更新培训类型
    updateTrainType: (params) => req.post('/college-service/TTrainType/updateTTrainType', params),

    //删除培训类型
    deleteTrainingType: fId => req.get(`/college-service/TTrainType/deleteTTrainTypeByFID/${fId}`)
};

