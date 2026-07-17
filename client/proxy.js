import { NextResponse } from 'next/server';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    
    // Statik dosyaları ve public yolları geç
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/login' ||
        pathname.includes('.') // .png, .ico, vs.
    ) {
        return NextResponse.next();
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const cookieHeader = request.headers.get('cookie') || '';
    
    try {
        // Backend /api/auth/me endpointinden rolleri çekiyoruz
        const response = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                cookie: cookieHeader
            }
        });
        
        if (!response.ok) {
            // Oturum geçersizse login sayfasına yönlendir
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        const data = await response.json();
        const roles = data.roles || [];
        
        // Admin yetkisi gerektiren prefixler
        const adminPaths = ['/personel', '/raporlar', '/panel', '/yetkilendirme'];
        const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
        
        if (isAdminPath && !roles.includes('ADMIN')) {
            // Admin değilse yetkisiz erişim, anasayfaya yönlendir
            return NextResponse.redirect(new URL('/', request.url));
        }
        
        return NextResponse.next();
        
    } catch (error) {
        console.error('Middleware Auth Error:', error);
        // Sunucu kapalıysa veya hata olursa logine at
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
