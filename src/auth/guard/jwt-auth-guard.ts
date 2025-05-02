import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenWithoutVerification(req);
    req.token = token;
    return super.canActivate(context);
  }

  // THERE IS NO VERIFICATION OF THE TOKEN HERE AS IT IS ALREADY DONE IN THE
  // SUPER CAN_ACTIVATE, THIS FUNCTION IS ONLY A UTIL FOR GET_WHOAMI
  extractTokenWithoutVerification(req: Request) {
    const authHeader = req.headers['authorization'] ?? '';
    return authHeader.split(' ')[1];
  }
}
