// 公共接口
import req from '@/utils/request';
//采集数据重启
export const collectRest = {
  restart: param => req.get(`/environmentsecurity-security-service/collectRest/restart/${param}`),
}  
