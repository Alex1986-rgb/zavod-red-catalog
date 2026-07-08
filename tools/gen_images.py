#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Пакетная генерация фотореалистичных фото редукторов через Replicate (FLUX).

Использование:
    export REPLICATE_API_TOKEN="r8_ваш_токен"
    python3 tools/gen_images.py                    # все категории, 3 варианта
    python3 tools/gen_images.py --only worm         # только червячный
    python3 tools/gen_images.py --variants 2        # 2 варианта на категорию
    python3 tools/gen_images.py --model dev         # качество выше (дороже)

Модели:
    schnell (по умолчанию) — быстро/дёшево, ~$0.003/фото
    dev                    — детальнее, ~$0.03/фото
    pro                    — flux-1.1-pro, максимум, ~$0.04/фото

Результат: assets/generated/<key>_v<N>.webp  (webp сразу под сайт, 4:3).
Оригиналы в assets/ не трогаются — лучшие выбираешь вручную.
"""
import os, sys, json, time, argparse, urllib.request, urllib.error

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "generated")

MODELS = {
    "schnell": "black-forest-labs/flux-schnell",
    "dev":     "black-forest-labs/flux-dev",
    "pro":     "black-forest-labs/flux-1.1-pro",
}

# Единый стиль продуктовой съёмки (англ. — FLUX так точнее)
STYLE = ("professional product photography, studio lighting, clean seamless white "
         "background, sharp focus, high detail, photorealistic, industrial equipment, "
         "cast iron housing, glossy blue paint, brushed steel shaft, 8k")

CATEGORIES = {
    "worm":        "an industrial worm gear motor reducer, blue painted cast iron NMRV "
                   "housing, attached electric motor with cooling fins, hollow output "
                   "shaft with bolted flange",
    "cylindrical": "an industrial helical inline gear motor reducer, blue cast iron "
                   "housing, keyed steel output shaft, ribbed electric motor",
    "bevel":       "an industrial bevel-helical gear motor reducer at an angle, blue "
                   "housing, output shaft, mounted electric motor",
    "coaxial":     "an industrial coaxial gearbox in a round blue flange housing, "
                   "steel output shaft, foot mounting",
    "flat":        "an industrial shaft-mounted flat parallel gear reducer, compact "
                   "blue housing, hollow output shaft, side-mounted electric motor",
    "variator":    "an industrial mechanical speed variator with electric motor, blue "
                   "housing, adjustment handwheel",
}


def api_post(path, token, body):
    req = urllib.request.Request(
        "https://api.replicate.com" + path,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Prefer": "wait",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def api_get(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def generate(token, model, prompt):
    body = {"input": {
        "prompt": prompt,
        "aspect_ratio": "4:3",
        "output_format": "webp",
        "output_quality": 90,
        "num_outputs": 1,
    }}
    if model == "schnell":
        body["input"]["go_fast"] = True
    pred = api_post(f"/v1/models/{MODELS[model]}/predictions", token, body)

    # с Prefer: wait обычно сразу succeeded; иначе опрашиваем
    for _ in range(60):
        status = pred.get("status")
        if status == "succeeded":
            out = pred.get("output")
            return out[0] if isinstance(out, list) else out
        if status in ("failed", "canceled"):
            print("   ✗", pred.get("error"))
            return None
        time.sleep(3)
        pred = api_get(pred["urls"]["get"], token)
    print("   ✗ таймаут")
    return None


def download(url, path):
    with urllib.request.urlopen(url, timeout=60) as r, open(path, "wb") as f:
        f.write(r.read())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="ключ категории, напр. worm")
    ap.add_argument("--variants", type=int, default=3)
    ap.add_argument("--model", choices=list(MODELS), default="schnell")
    args = ap.parse_args()

    token = os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        sys.exit("Задайте REPLICATE_API_TOKEN (см. шапку файла).")

    os.makedirs(OUT_DIR, exist_ok=True)
    cats = {args.only: CATEGORIES[args.only]} if args.only else CATEGORIES
    print(f"Модель: {MODELS[args.model]}  •  вариантов на категорию: {args.variants}\n")

    for key, subject in cats.items():
        prompt = f"{subject}, {STYLE}"
        for v in range(1, args.variants + 1):
            print(f"→ {key} v{v} …")
            try:
                url = generate(token, args.model, prompt)
            except urllib.error.HTTPError as e:
                print("   ✗ HTTP", e.code, e.read().decode(errors="ignore")[:200])
                continue
            if not url:
                continue
            path = os.path.join(OUT_DIR, f"{key}_v{v}.webp")
            download(url, path)
            print(f"   ✓ {os.path.relpath(path)}")

    print("\nГотово → assets/generated/. Выбери лучшие, дальше подключу в каталог.")


if __name__ == "__main__":
    main()
