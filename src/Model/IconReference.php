<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Model;

final class IconReference
{
    public function __construct(
        public readonly string $pool,
        public readonly string $name,
    ) {}

    /**
     * Accepts the stored field value {pool, name}, "pool:name" or a bare name (resolved against $defaultPool).
     */
    public static function fromValue(mixed $value, ?string $defaultPool): ?self
    {
        if ($value instanceof self) {
            return $value;
        }

        if (\is_array($value)) {
            $pool = $value['pool'] ?? $defaultPool;
            $name = $value['name'] ?? null;
        } elseif (\is_string($value)) {
            [$pool, $name] = str_contains($value, ':') ? explode(':', $value, 2) : [$defaultPool, $value];
        } else {
            return null;
        }

        if (!\is_string($pool) || '' === $pool || !\is_string($name) || '' === $name) {
            return null;
        }

        return new self($pool, $name);
    }

    public function getSymbolId(): string
    {
        return $this->pool . '-' . $this->name;
    }

    /**
     * @return array{pool: string, name: string}
     */
    public function toArray(): array
    {
        return ['pool' => $this->pool, 'name' => $this->name];
    }
}
