<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Pool;

use Manuxi\SuluIconPickerBundle\Model\IconReference;

final class IconPoolRegistry
{
    /** @var array<string, IconPoolInterface> */
    private array $pools = [];

    /**
     * @param iterable<IconPoolInterface> $pools
     */
    public function __construct(iterable $pools)
    {
        foreach ($pools as $pool) {
            $key = $pool->getKey();
            if (isset($this->pools[$key])) {
                throw new \LogicException(\sprintf('Icon pool "%s" is registered more than once.', $key));
            }

            $this->pools[$key] = $pool;
        }
    }

    public function has(string $key): bool
    {
        return isset($this->pools[$key]);
    }

    public function get(string $key): IconPoolInterface
    {
        if (!isset($this->pools[$key])) {
            throw new \InvalidArgumentException(\sprintf('Icon pool "%s" is not registered. Available: "%s".', $key, implode('", "', array_keys($this->pools))));
        }

        return $this->pools[$key];
    }

    /**
     * @return array<string, IconPoolInterface>
     */
    public function all(): array
    {
        return $this->pools;
    }

    public function getDefaultKey(): ?string
    {
        return array_key_first($this->pools);
    }

    public function isValid(IconReference $icon): bool
    {
        return $this->has($icon->pool) && $this->pools[$icon->pool]->hasIcon($icon->name);
    }

    public function createReference(mixed $value): ?IconReference
    {
        return IconReference::fromValue($value, $this->getDefaultKey());
    }
}
