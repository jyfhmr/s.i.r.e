import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PAGE_KEY = 'require_page';

// Pasamos el nombre exacto de la página tal cual está en tu DAUGHTER_PAGES
export const RequirePage = (pageName: string) => SetMetadata(REQUIRE_PAGE_KEY, pageName);
