<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Pool;

abstract class AbstractSpriteIconPool implements IconPoolInterface
{
    private const PUBLIC_PREFIX = 'bundles/suluiconpicker/icon-picker/';

    /** @var array<string, int>|null */
    private ?array $index = null;

    public function getSpritePath(): string
    {
        return self::PUBLIC_PREFIX . $this->getKey() . '/sprite.svg';
    }

    public function getNamesPath(): string
    {
        return self::PUBLIC_PREFIX . $this->getKey() . '/names.json';
    }

    public function getIconNames(): array
    {
        return array_keys($this->getIndex());
    }

    public function hasIcon(string $name): bool
    {
        return isset($this->getIndex()[$name]);
    }

    protected function getResourceDirectory(): string
    {
        return \dirname(__DIR__) . '/Resources/public/icon-picker/' . $this->getKey();
    }

    /**
     * @return array<string, int>
     */
    private function getIndex(): array
    {
        if (null !== $this->index) {
            return $this->index;
        }

        $file = $this->getResourceDirectory() . '/names.json';
        if (!is_file($file)) {
            throw new \RuntimeException(\sprintf('Icon names of pool "%s" not found at "%s". Run "npm run build-icons" in the bundle.', $this->getKey(), $file));
        }

        $names = json_decode((string) file_get_contents($file), true, 512, \JSON_THROW_ON_ERROR);

        return $this->index = array_flip(array_map('strval', (array) $names));
    }
}
