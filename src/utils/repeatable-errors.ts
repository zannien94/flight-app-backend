import { NotFoundException } from '@nestjs/common';

export const ifNoData = (data: any, dataType: string) => {
  if (!data) throw new NotFoundException(`${dataType} not found`);
};
