<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Pool;

interface IconPoolInterface
{
    public function getKey(): string;

    /**
     * Asset path relative to the public directory, resolved via the asset packages.
     */
    public function getSpritePath(): string;

    public function getNamesPath(): string;

    /**
     * @return list<string>
     */
    public function getIconNames(): array;

    public function hasIcon(string $name): bool;
}
