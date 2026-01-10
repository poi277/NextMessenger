// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.session) {
      console.log('세션이 초기화되지 않았습니다')
      throw new UnauthorizedException('세션이 초기화되지 않았습니다.');
    }
    
    if (!request.session.isAuthenticated) {
          console.log('인증이 필요합니다')
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    
    // req.user에 정보 추가
    request.user = {
      name: request.session.userName,
      userObjectId: request.session.userObjectId
    };
    
    return true;
  }
}