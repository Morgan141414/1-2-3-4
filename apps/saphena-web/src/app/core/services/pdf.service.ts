import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {ProtocolTargetType} from '../model/protocol.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private readonly http = inject(HttpClient);

  downloadPdf(
    targetType: ProtocolTargetType,
    protocolDataId: string,
    lang?: string,
  ) {
    return this.http.get(`/api/pdf?targetType=${targetType}&protocolDataId=${protocolDataId}&lang=${lang}`,
      { responseType: 'blob' }
    ).pipe(
      tap(blob => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
    );
  }

}
