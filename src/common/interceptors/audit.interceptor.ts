// common/interceptors/audit.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OracleService } from '../../config/oracle.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private oracleService: OracleService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = (req as any).user;
    const method = req.method;
    const path = req.path;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const responseTime = Date.now() - startTime;
        
        // Only log if user is authenticated
        if (user && user.id) {
          try {
            await this.oracleService.execute(`
              INSERT INTO audit_log (USER_ID, ACTION, RESOURCE_TYPE, IP_ADDRESS, DETAILS)
              VALUES (:userId, :action, 'API', :ip, :details)
            `, {
              userId: user.id,
              action: `${method} ${path}`,
              ip: req.ip || req.socket.remoteAddress,
              details: JSON.stringify({ 
                method, 
                path, 
                responseTime,
                statusCode: context.switchToHttp().getResponse().statusCode 
              })
            });
          } catch (err) {
            console.error('Audit log error:', err);
          }
        }
      }),
    );
  }
}