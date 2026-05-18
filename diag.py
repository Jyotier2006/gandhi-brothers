import os, re, json, traceback
from google.oauth2 import service_account
from googleapiclient.discovery import build

try:
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    creds = service_account.Credentials.from_service_account_info({
        'type': 'service_account',
        'project_id': 'gandhi-brothers-orders',
        'private_key_id': '4c3d2e1f0b9a8c7d6e5f4b3a2c1d0e9f8g7h6i',
        'private_key': '''-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7oCgq2V3QmVKO\ngDO8AvT+J3CWalolTYdtAdWaDgRp42LmuXc/NucK+3K+V5lGTJkfTOnMfTYC5x6R\nD5MfS0nP9viSUWp10o8rt8iY1R8zEJio2GqlDwqXckC6UHk+ZoqAGqAGaBXDN7Fw\nhs5Py4VxbIQrfKdZRpU3mfVkRx31+kQXPecr6RHLdLrKd0Iv/UVibXz2kzxb04P8\nLWJ/68ZcV3nZYqFj/QL+1q8dqkTbwIogVCI5nWTzN5ynU/783AQa00+hrkVrBDle\nrMjSPA1JojD7aam9CB9jW1Wgte6oLDdRJa6306qlZPIS5kz/xX4F/J42wQc3iWDb\n52al9xE9AgMBAAECggEAEZSQZvFul67iHC2Zi16Yj57o7wMglrm0vItNNS3mjnhq\nqjVLHd56WB5W8kxZdYuUVmk5x/ocfzmiNNPphGdkz2p0AJvF1qvn0+AY2O8xSPLf\nZwS+O2CVLLsdIwgK0ETB6f50q50BmwTjKKjM+I+YnZfeK4f200foj+jqZB7AyS0k\np/cHgztcE5OpAwXFWbgoqDDOucmA0Fv2nevdVW7FjrKw7FEGEh6fmDaHp5+i8Nuz\n4LBLbYaWvZElcXeqcnXj5TJ49jWqMLrHL8ir+82wtWNZISLcyvylwC85R9+tfCT2\nX1jyWpbQDaJ6U5vHkpuhuceT+3O8/jGOTIkSLsE0UQKBgQDmiv+ort6hb+GHmnWI\nRqOZZMA8AN0sUKkeqpSz0BwTYnjy5Gnm2b7vwheAPXKj3FhwjCfnnOjN7qZ7dq7m\nvYpkNBJld49qw5s5yMZYmkcErf90FcUXEg/fzVMHgbdnoj7MVrt3c9kllbqJZ4vQ\nL6oSItC1ZqN/xajQwp6mrNKpUQKBgQDQV/fah2KI/5bivdSVJySbdQshOxJYy9GG\n316+yXy32C9Qmt0YAAlJzeGCRIoberdEcyNAJ18wnQmmvC7Tz17d5jeV324Ocjd3\nGsHwbD+X6N9CPTMuvGCTLc/MLFtycl9U5B51hrHHBn4rF21Sw5zh3Be185KlOU22\n9ZKiUabuLQKBgQDKHbJlwGmOPvgKWnAQOV3UbW/bKya8Yzrhl8smmZ0DoaFH0NjH\ner7ak97mnviSj+s5QKb7d6TiZgeu1i4gPKvHjZ9TNa6We0brMgoyQ49fmuwKacuQ\nnlUscGYKfr68LJHBs4hHAVmuicYwEIeSzTbdD4jKgGF282M9ImLU3U8TAQKBgDRS\nAxJD8YDJ/tBOL7aNL+pCSFs+BGt8M9AVBCwRWVqp1af+XAuM5sg8Bae7IpuoA6IS\n8AVKXeNNbIEMvQ3AA+jhyY+/nlnOYRNuCsofxRCXEIoH6HSSJgaP+KEjeouRIVOm\nPefxvW9nuAOGTJP+P8WQifvNgUQw0c1iekJ9Eti5AoGBANPWd5cCAKVNrbnYrc4w\nnUEPNiDB8/hR9COV27AwMe2tWg6pjsy+MfKSo+DScaWWgg7ik5flxRyTWS1QjZmj\n5TTf6I6Yex5bjetGchkW+9Th+c2nyEmQm/K+QfR5S2Fdm0DDL20hHVyv0cLeQ37K\nS+a3Ot/e5WG3pm7Q40XLY17B\n-----END PRIVATE KEY-----''',
        'client_email': 'sheets-writer@gandhi-brothers-orders.iam.gserviceaccount.com',
        'token_uri': 'https://oauth2.googleapis.com/token',
    }, scopes=SCOPES)
    
    service = build('sheets', 'v4', credentials=creds)
    res = service.spreadsheets().values().get(spreadsheetId='1WYDVoHU0nxrnBLwIc6Cd5m2jH15rIESIlwyLe9yd2Xo', range='Products!A1:Z').execute()
    
    rows = res.get('values', [])
    headers = rows[0]
    hmap = {h.strip(): i for i, h in enumerate(headers)}
    
    # Check for correct header name
    slug_col = hmap.get('Slug', -1)
    name_col = hmap.get('Product Name', -1)
    pack_col = hmap.get('Pack Size', -1)
    cat_col = hmap.get('Category', -1)
    status_col = hmap.get('Status', -1)
    
    products = []
    print('=== 1. PRODUCT SHEET LISTING ===')
    for row in rows[1:]:
        row += [''] * (len(headers) - len(row))
        if status_col >= 0 and row[status_col] != 'Active': continue
        slug = row[slug_col] if slug_col >= 0 else ''
        name = row[name_col] if name_col >= 0 else ''
        pack = row[pack_col] if pack_col >= 0 else ''
        cat = row[cat_col] if cat_col >= 0 else ''
        
        products.append((slug, name, pack, cat))
        print(f"{slug:<35} | {name:<35} | {pack:<7} | {cat}")
        
    print('\n=== 2. CURRENT IMAGE FILES (public/products/) ===')
    img_dir = os.path.join('public', 'products')
    if os.path.exists(img_dir):
        files = [f for f in os.listdir(img_dir) if f.endswith('.svg') or f.endswith('.png')]
    else:
        files = []
    
    for f in sorted(files): print(f)

    print('\n=== 3. MISMATCH REPORT ===')
    exact = []
    base_match = []
    no_match = []
    for slug, _, _, _ in products:
        if not slug: continue
        base_slug = re.sub(r'-\d+[a-zA-Z]+$', '', slug)
        
        if f"{slug}.png" in files or f"{slug}.svg" in files:
            exact.append(slug)
        elif f"{base_slug}.png" in files or f"{base_slug}.svg" in files:
            base_match.append((slug, base_slug))
        else:
            no_match.append(slug)
    
    sheet_slugs = [p[0] for p in products if p[0]]
    sheet_base_slugs = [re.sub(r'-\d+[a-zA-Z]+$', '', p[0]) for p in products if p[0]]
    
    orphans = []
    for f in files:
        base = f.rsplit('.', 1)[0]
        if base not in sheet_slugs and base not in sheet_base_slugs:
            if base != '_fallback': orphans.append(f)

    print(f'\nExact match: {len(exact)}')
    print(f'Base name match (missing pack size): {len(base_match)}')
    for s, b in base_match:
        print(f'  {s} -> falls back to {b}')
    print(f'No match at all: {len(no_match)}')
    for s in no_match:
        print(f'  {s}')
    print(f'Orphan files: {len(orphans)}')
    for o in orphans:
        print(f'  {o}')

except Exception as e:
    traceback.print_exc()
